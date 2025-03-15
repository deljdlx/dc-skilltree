#!/bin/bash

echo -e "\e[92mInitialize docker compose validator"
cd /var/www/html/modules/docker-compose/backend/validator

echo -e "\e[92mnpm install"
npm install

echo -e "\e[92mStarting validator..."
nodejs validator.js &


echo -e "\e[92mStarting Apache..."
apachectl start
echo -e "\e[92mURL : http://localhost:8080"

# infinite loop to keep the container running
while true
do
  sleep 1
done
