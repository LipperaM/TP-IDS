.PHONY: up down restart logs build ps local local-down local-restart backend frontend db cloudflared

# Variables

# El flag -f permite especificar el archivo compose exacto.

ROOT_COMPOSE = docker compose -f docker-compose.yml
BACKEND_COMPOSE = docker compose -f ./backend/docker-compose.yml
FRONTEND_COMPOSE = docker compose -f ./frontend/docker-compose.yml
DB_COMPOSE = docker compose -f ./db/docker-compose.yml
CLOUDFLARED_COMPOSE = docker compose -f ./cloudflared/docker-compose.yml


# Compose general ROOT

up:
	$(ROOT_COMPOSE) up -d

down:
	$(ROOT_COMPOSE) down

restart:
	$(ROOT_COMPOSE) down
	$(ROOT_COMPOSE) up -d

logs:
	$(ROOT_COMPOSE) logs -f

build:
	$(ROOT_COMPOSE) build

ps:
	$(ROOT_COMPOSE) ps


# Compose general sin Cloudflare Tunnel (local)

local:
	$(BACKEND_COMPOSE) up -d 
	$(FRONTEND_COMPOSE) up -d
	$(DB_COMPOSE) up -d

local-down:
	$(BACKEND_COMPOSE) down 
	$(FRONTEND_COMPOSE) down
	$(DB_COMPOSE) down
	
local-restart: local-down local	

# Sub composes hijos


backend:
	$(BACKEND_COMPOSE) up -d

backend-down:
	$(BACKEND_COMPOSE) down

frontend:
	$(FRONTEND_COMPOSE) up -d

frontend-down:
	$(FRONTEND_COMPOSE) down

db:
	$(DB_COMPOSE) up -d

db-down:
	$(DB_COMPOSE) down

cloudflared:
	$(CLOUDFLARED_COMPOSE) up -d

cloudflared-down:
	$(CLOUDFLARED_COMPOSE) down
