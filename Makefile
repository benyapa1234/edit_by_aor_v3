# Makefile

DOCKER_COMPOSE = docker-compose

.PHONY: up down clear-volumes restart logs

up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

clear-volumes:
	$(DOCKER_COMPOSE) down -v

restart:
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) up -d

logs:
	$(DOCKER_COMPOSE) logs -f

mysql:
	docker-compose exec mysql mysql -u test -p
