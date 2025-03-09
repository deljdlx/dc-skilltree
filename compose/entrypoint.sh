#!/bin/bash

echo -e "\e[92mStarting Apache..."
apachectl start
echo -e "\e[92mURL : http://localhost:8080"

# infinite loop to keep the container running
while true
do
  sleep 1
done
