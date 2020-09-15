#!/bin/bash

echo "Building the containers..."
docker-compose build --no-cache

echo "Setting up the database..."
docker-compose run subscription npx sequelize db:drop
docker-compose run subscription npx sequelize db:create
docker-compose run subscription npx sequelize db:migrate
docker-compose run subscription npx sequelize db:seed:all
