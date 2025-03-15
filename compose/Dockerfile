# Utiliser une image PHP de base
FROM php:8.3-apache

# Installer Git dans l'image Docker
RUN apt-get update \
    && apt-get install -y vim \
    && apt-get install -y cron \
    && apt-get install -y git \
    && apt-get install -y lsb-release \
    && apt-get install -y wget \
    && apt-get install -y tree \
    && apt-get install -y zip \
    && apt-get install -y curl \
    && apt-get install -y unzip \
    && apt-get install -y jq \
    && apt-get install -y ntp \
    && apt-get install -y imagemagick\
    && apt-get install -y gnupg2 \
    && apt-get install -y build-essential \
    && apt-get install -y libzip-dev \
    && apt-get install -y libpng-dev \
    && apt-get install -y libjpeg-dev \
    && apt-get install -y libfreetype6-dev \
    && apt-get install -y libmemcached-dev \
    && apt-get install zlib1g-dev \
    && apt-get install -y libxml2-dev \
    && apt-get install -y  libssl-dev \
    && apt-get update && apt-get install -y sqlite3 libsqlite3-dev\
    && apt-get update && apt-get install -y telnet\
    && apt-get install -y default-mysql-client \
    # =========================================
    && pecl install xdebug memcached \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd zip mysqli intl pdo pdo_sqlite pdo_mysql \
    && docker-php-ext-enable xdebug memcached \
    && apt-get clean && rm -rf /var/lib/apt/lists/* \
    # =========================================
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    # =========================================
    && apt-get update && apt-get install -y nodejs npm \
    # =========================================
    &&  git config --global user.email "root@docker" \
    &&  git config --global user.name "Root Docker"

# Install docker
# Add Docker's official GPG key:
RUN apt-get install ca-certificates \
    && install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc \
    && chmod a+r /etc/apt/keyrings/docker.asc
    # Add the repository to Apt sources:

RUN echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

WORKDIR /var/www/html

RUN a2enmod rewrite
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]

# CMD ["apache2-foreground"]

